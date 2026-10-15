<?php

namespace Tests\Feature;

use Tests\TestCase;

class DocumentationRenderingTest extends TestCase
{
    public function test_documentation_with_a_table_of_contents_renders(): void
    {
        $this->get('/antlers')
            ->assertOk()
            ->assertSee('Antlers')
            ->assertSee('type="module"', false)
            ->assertSee('/build/assets/', false)
            ->assertSee('class="toc"', false);
    }

    public function test_control_panel_login_assets_are_published(): void
    {
        $this->followingRedirects()->get('/cp')
            ->assertOk()
            ->assertSee('Email')
            ->assertSee('Password');
    }
}
